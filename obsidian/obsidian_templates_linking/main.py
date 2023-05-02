templates = """0_Image image
2 divs left-right
2Div up-down
dataview_table
fire
get file content
Get files by tag
lightning
mermaid_class_diagram
mermaid_flowchart
mermaid_gantt
mermaid_git_graph
mermaid_graph
mermaid_pie_chart
mermaid_state_diagram
standup_0X.XX.2023
table html
tags
TEMPLATE Kanban task"""

for i in templates.split("\n"):
    print(f"[[{i}]]")
