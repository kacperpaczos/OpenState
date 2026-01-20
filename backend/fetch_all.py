import concurrent.futures
from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn
from rich.console import Console
import sys
import os

# Import our customized fetchers
from fetch_votings import run_fetch as fetch_votings
from fetch_senate import run_fetch as fetch_senate
from fetch_rcl import run_fetch as fetch_rcl

def run_script(func, progress, task_id):
    try:
        func(progress=progress, task_id=task_id)
    except Exception as e:
        progress.console.print(f"[red]Error in task {task_id}: {e}[/red]")

def main():
    console = Console()
    console.print("[bold green]🚀 Starting Parallel Data Fetch...[/bold green]")
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        console=console,
    ) as progress:
        
        # Create tasks
        task1 = progress.add_task("[cyan]Sejm Votings...", total=None) # We don't know total yet
        task2 = progress.add_task("[magenta]Senate...", total=None)
        task3 = progress.add_task("[yellow]Government Bills (RCL)...", total=100) # Percentage based
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            futures = [
                executor.submit(run_script, fetch_votings, progress, task1),
                executor.submit(run_script, fetch_senate, progress, task2),
                executor.submit(run_script, fetch_rcl, progress, task3)
            ]
            
            concurrent.futures.wait(futures)
            
    console.print("[bold green]✨ All scraping tasks completed![/bold green]")

if __name__ == "__main__":
    main()
