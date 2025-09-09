import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/config/app.config';

declare global {
  var activeSandbox: any;
  var sandboxData: any;
}

export async function POST(request: NextRequest) {
  try {
    if (!global.activeSandbox) {
      return NextResponse.json({ 
        success: false, 
        error: 'No active sandbox. Please create a sandbox first.' 
      }, { status: 400 });
    }
    
    console.log('[create-zip] Creating project zip...');
    
    // First, check if the sandbox is still alive by running a simple command
    try {
      await global.activeSandbox.runCode('print("Sandbox health check")');
      console.log('[create-zip] Sandbox is responsive');
    } catch (healthError) {
      console.error('[create-zip] Sandbox health check failed:', healthError);
      return NextResponse.json({
        success: false,
        error: 'Sandbox has timed out or is no longer accessible. Please create a new sandbox.',
        code: 502
      }, { status: 502 });
    }
    
    // Extend sandbox timeout if the method is available
    if (typeof global.activeSandbox.setTimeout === 'function') {
      try {
        global.activeSandbox.setTimeout(appConfig.e2b.timeoutMs);
        console.log('[create-zip] Extended sandbox timeout');
      } catch (timeoutError) {
        console.warn('[create-zip] Could not extend timeout:', timeoutError);
      }
    }
    
    // Create zip file in sandbox with improved error handling
    const result = await global.activeSandbox.runCode(`
import zipfile
import os
import json
import time

try:
    # Change to app directory
    os.chdir('/home/user/app')
    print(f"Current directory: {os.getcwd()}")
    
    # List files to be zipped (for debugging)
    print("Files to be zipped:")
    file_count = 0
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and .git
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'build']]
        
        for file in files:
            file_path = os.path.join(root, file)
            print(f"  {file_path}")
            file_count += 1
    
    print(f"Total files to zip: {file_count}")
    
    # Create zip file
    zip_path = '/tmp/project.zip'
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Skip node_modules and .git
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'build']]
            
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, '.')
                try:
                    zipf.write(file_path, arcname)
                except Exception as e:
                    print(f"Warning: Could not add {file_path}: {e}")
    
    # Verify zip file was created
    if os.path.exists(zip_path):
        file_size = os.path.getsize(zip_path)
        print(f"✓ Created project.zip ({file_size} bytes)")
        
        # Test that the zip file is valid
        with zipfile.ZipFile(zip_path, 'r') as test_zip:
            zip_files = test_zip.namelist()
            print(f"✓ Zip contains {len(zip_files)} files")
    else:
        raise Exception("Zip file was not created")
        
except Exception as e:
    print(f"ERROR: {str(e)}")
    import traceback
    traceback.print_exc()
    raise
    `);
    
    console.log('[create-zip] Zip creation result:', result.logs);
    
    // Check if there were any errors in the zip creation
    if (result.logs.stderr.length > 0) {
      const errorLogs = result.logs.stderr.join('\n');
      console.error('[create-zip] Zip creation had errors:', errorLogs);
      
      // If there are critical errors, fail
      if (errorLogs.toLowerCase().includes('error:') || errorLogs.toLowerCase().includes('exception')) {
        return NextResponse.json({
          success: false,
          error: `Zip creation failed: ${errorLogs}`,
          details: result.logs
        }, { status: 500 });
      }
    }
    
    // Read the zip file and convert to base64
    const readResult = await global.activeSandbox.runCode(`
import base64

with open('/tmp/project.zip', 'rb') as f:
    content = f.read()
    encoded = base64.b64encode(content).decode('utf-8')
    print(encoded)
    `);
    
    const base64Content = readResult.logs.stdout.join('').trim();
    
    // Create a data URL for download
    const dataUrl = `data:application/zip;base64,${base64Content}`;
    
    return NextResponse.json({
      success: true,
      dataUrl,
      fileName: 'e2b-project.zip',
      message: 'Zip file created successfully'
    });
    
  } catch (error) {
    console.error('[create-zip] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}