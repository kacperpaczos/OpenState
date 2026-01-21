import subprocess
import os
import sys
import threading
import time
import datetime

# Thread-safe lock for writing to log file
log_lock = threading.Lock()

def log_to_file(log_path, message):
    with log_lock:
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(message + "\n")

def run_script(script_path, description, results, log_path):
    print(f"[START] {description}...")
    start_time = time.time()
    
    log_to_file(log_path, f"--- START: {description} ---")
    
    try:
        cmd = [sys.executable, script_path]
        result = subprocess.run(cmd, capture_output=True, text=True)
        duration = time.time() - start_time
        
        # Log Output
        output_msg = f"Output for {description}:\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}\n"
        log_to_file(log_path, output_msg)
        
        success = (result.returncode == 0)
        status_str = "DONE" if success else "FAIL"
        
        if success:
            print(f"[{status_str}] {description} ({duration:.1f}s)")
        else:
            print(f"[{status_str}] {description} ({duration:.1f}s) - Check log for details")
            
        results.append({
            "name": description,
            "success": success,
            "duration": duration
        })
        
        log_to_file(log_path, f"--- END: {description} (Status: {status_str}, Time: {duration:.1f}s) ---\n")
            
    except Exception as e:
        print(f"[ERROR] {description}: {e}")
        log_to_file(log_path, f"--- ERROR: {description}: {e} ---\n")
        results.append({
            "name": description,
            "success": False,
            "duration": 0
        })

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.abspath(os.path.join(script_dir, '..'))
    backend_dir = script_dir
    log_dir = os.path.join(backend_dir, 'logs')
    
    os.makedirs(log_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    log_path = os.path.join(log_dir, f"pipeline_{timestamp}.log")
    
    print("========================================")
    print("   OpenOurGov Data Refresh Engine       ")
    print(f"   Log File: {log_path}")
    print("========================================")
    
    log_to_file(log_path, f"Pipeline Run Started at {timestamp}\n")
    
    scripts = [
        (os.path.join(backend_dir, 'fetch_mps.py'), "MPs Fetch"),
        (os.path.join(backend_dir, 'fetch_senators.py'), "Senators Fetch"),
        (os.path.join(backend_dir, 'fetch_bills.py'), "Bills Fetch"), 
        (os.path.join(backend_dir, 'fetch_votings.py'), "Votings Fetch"),
        (os.path.join(backend_dir, 'fetch_interpellations.py'), "Interpellations Fetch"),
        (os.path.join(backend_dir, 'fetch_senate.py'), "Senate Fetch"),
        (os.path.join(backend_dir, 'fetch_rcl.py'), "RCL Fetch"),
    ]
    
    results = []
    threads = []
    start_total = time.time()
    
    for script, desc in scripts:
        t = threading.Thread(target=run_script, args=(script, desc, results, log_path))
        t.start()
        threads.append(t)
        
    for t in threads:
        t.join()
        
    print("----------------------------------------")
    print("Building Application...")
    log_to_file(log_path, "--- START: Application Build ---\n")
    
    frontend_dir = os.path.join(root_dir, 'frontend')
    build_success = False
    
    try:
        build_start = time.time()
        # Capture output for build as well to keep console clean-ish, or let it stream?
        # User asked for logs of every action. Let's capture.
        build_result = subprocess.run("npm run build", cwd=frontend_dir, shell=True, capture_output=True, text=True)
        build_duration = time.time() - build_start
        
        log_to_file(log_path, f"Build Output:\nSTDOUT:\n{build_result.stdout}\nSTDERR:\n{build_result.stderr}\n")
        
        if build_result.returncode == 0:
            print(f"[DONE] Build Application ({build_duration:.1f}s)")
            build_success = True
        else:
            print(f"[FAIL] Build Application ({build_duration:.1f}s) - Check log")
            
        results.append({
            "name": "Frontend Build",
            "success": build_success,
            "duration": build_duration
        })
        log_to_file(log_path, f"--- END: Application Build (Success: {build_success}) ---\n")
        
    except Exception as e:
        print(f"[ERROR] Build: {e}")
        log_to_file(log_path, f"--- ERROR: Build: {e} ---\n")
        results.append({"name": "Frontend Build", "success": False, "duration": 0})

    total_duration = time.time() - start_total
    
    # Summary
    print("\n========================================")
    print("           PIPELINE SUMMARY             ")
    print("========================================")
    
    all_ok = True
    for res in results:
        status = "OK" if res['success'] else "FAIL"
        if not res['success']: all_ok = False
        print(f" {res['name']:<25} : {status} ({res['duration']:.1f}s)")
        
    print("----------------------------------------")
    
    if all_ok:
        print(f"RESULT: SUCCESS (Total: {total_duration:.1f}s)")
        log_to_file(log_path, f"\nFINAL RESULT: SUCCESS (Total: {total_duration:.1f}s)")
    else:
        print(f"RESULT: FAILURE (Some steps failed)")
        log_to_file(log_path, f"\nFINAL RESULT: FAILURE (Some steps failed)")
        
    print(f"Details saved to: {log_path}")

if __name__ == "__main__":
    main()
