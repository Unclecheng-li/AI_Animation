import pandas as pd
import os
import json
import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.prompt import Prompt, IntPrompt
from rich import print as rprint

CONSOLE = Console()
STATUS_FILE = "gst_status.json"
EXCEL_FILE = "GST_Checklist.xlsx"

def load_data():
    """Reads the Excel file and segments it into categories."""
    try:
        df = pd.read_excel(EXCEL_FILE)
        
        checklists = {
            "GSTR-1": [],
            "GSTR-2B": [],
            "GSTR-3B": []
        }
        
        current_cat = "GSTR-1"
        
        for _, row in df.iterrows():
            point = row["GSTR - 1 Check Points"]
            if pd.isna(point):
                continue
                
            # Detect category switches
            if "GSTR-2B" in str(point):
                current_cat = "GSTR-2B"
                continue
            elif "GSTR 3B" in str(point):
                current_cat = "GSTR-3B"
                continue
            
            # Skip rows that are just headers or metadata
            if any(h in str(point) for h in ["Check Points", "S.no Continuing"]):
                continue
                
            checklists[current_cat].append(str(point).strip())
            
        return checklists
    except Exception as e:
        CONSOLE.print(f"[bold red]Error loading Excel file:[/bold red] {e}")
        return None

def load_status():
    """Loads the completion status from a JSON file."""
    if os.path.exists(STATUS_FILE):
        with open(STATUS_FILE, "r") as f:
            return json.load(f)
    return {}

def save_status(status):
    """Saves the completion status to a JSON file."""
    with open(STATUS_FILE, "w") as f:
        json.dump(status, f, indent=4)

def display_checklist(category, items, status):
    """Displays a formatted table of items for a specific category."""
    table = Table(title=f"GST Checklist - {category}", show_header=True, header_style="bold magenta")
    table.add_column("ID", style="dim", width=4)
    table.add_column("Task", width=60)
    table.add_column("Due Info", justify="center")
    table.add_column("Status", justify="center")

    today = datetime.datetime.now().day
    
    cat_status = status.get(category, {})

    for i, item in enumerate(items, 1):
        is_done = cat_status.get(str(i), False)
        status_text = "[green]✔ Done[/green]" if is_done else "[red]✘ Pending[/red]"
        
        # Highlight tasks due today
        due_info = ""
        is_due_today = False
        if "On " in item:
            day_str = item.split("On ")[1].split(" ")[0].replace("st", "").replace("nd", "").replace("rd", "").replace("th", "")
            if day_str.isdigit():
                due_info = f"Day {day_str}"
                if int(day_str) == today:
                    is_due_today = True
        elif " - " in item:
            # Handle formats like "15th" or "14th"
            parts = item.split(" - ")
            for p in parts:
                if any(x in p.lower() for x in ["th", "st", "nd", "rd"]) and any(c.isdigit() for c in p):
                    day_val = "".join(filter(str.isdigit, p))
                    if day_val:
                        due_info = f"Day {day_val}"
                        if int(day_val) == today:
                            is_due_today = True

        task_style = "bold cyan" if is_due_today and not is_done else ""
        table.add_row(
            str(i),
            item,
            f"[bold yellow]{due_info}[/bold yellow]" if due_info else "-",
            status_text,
            style=task_style
        )

    CONSOLE.print(table)

def main():
    CONSOLE.print(Panel.fit("[bold blue]GST Compliance Management System[/bold blue]\n[italic]Data sourced from GST_Checklist.xlsx[/italic]", border_style="blue"))
    
    data = load_data()
    if not data:
        return

    status = load_status()
    
    while True:
        rprint("\n[bold]Main Menu:[/bold]")
        rprint("1. GSTR-1 Checklist")
        rprint("2. GSTR-2B Checklist")
        rprint("3. GSTR-3B Checklist")
        rprint("4. Reset All Progress")
        rprint("5. Exit")
        
        choice = Prompt.ask("Select an option", choices=["1", "2", "3", "4", "5"])
        
        if choice == "5":
            rprint("[yellow]Goodbye![/yellow]")
            break
        
        if choice == "4":
            if Prompt.ask("Are you sure you want to reset all status?", choices=["y", "n"]) == "y":
                status = {}
                save_status(status)
                rprint("[green]Status reset successfully.[/green]")
            continue

        category = list(data.keys())[int(choice) - 1]
        items = data[category]
        
        while True:
            CONSOLE.clear()
            display_checklist(category, items, status)
            
            rprint("\n[dim]Enter ID to toggle status, or '0' to return to menu.[/dim]")
            task_id = IntPrompt.ask("Toggle Task ID")
            
            if task_id == 0:
                break
            
            if 1 <= task_id <= len(items):
                cat_status = status.get(category, {})
                current_val = cat_status.get(str(task_id), False)
                cat_status[str(task_id)] = not current_val
                status[category] = cat_status
                save_status(status)
            else:
                rprint("[red]Invalid ID![/red]")

if __name__ == "__main__":
    main()
