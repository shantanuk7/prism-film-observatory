import os

def print_tree(startpath, file_out, exclude_dirs, exclude_files):
    """
    Recursively prints the directory and file tree structure.
    """
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
        
        file_out.write(f'{indent}📂 {os.path.basename(root)}/\n')
        
        subindent = ' ' * 4 * (level + 1)
        for f in sorted(files):
            # Exclude files
            if f not in exclude_files:
                file_out.write(f'{subindent}📄 {f}\n')

def generate_main_files_summary(
    output_file="combined_output.txt",
    exclude_dirs=None,
    exclude_files=None,
    include_extensions=None
):
    if exclude_dirs is None:
        exclude_dirs = ["node_modules", ".git", "__pycache__", ".venv", "dist", "build"]
    
    if exclude_files is None:
        exclude_files = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "get_contents.py", "tailwind.config.js", "README.md", "vite.config.js",".gitignore","eslint.config.js",".env",".env.example",]

    if include_extensions is None:
        include_extensions = [".json", ".js", ".ts", ".jsx", ".tsx", ".py", ".html", ".css", ".md", ".txt"]

    output_path = os.path.abspath(output_file)

    with open(output_path, "w", encoding="utf-8") as out:
        # 1. Print the file tree structure
        out.write("### 📂 Project File Tree\n\n")
        print_tree(".", out, exclude_dirs, exclude_files)
        out.write("\n" + "-"*40 + "\n\n")

        # 2. Add the content of selected files
        out.write("### 📝 File Contents\n\n")
        for root, dirs, files in os.walk("."):
            # Modify dirs in-place to prevent os.walk from entering excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            for file in files:
                # Exclude specific files
                if file in exclude_files:
                    continue
                
                # Include only selected extensions
                if not any(file.endswith(ext) for ext in include_extensions):
                    continue

                file_path = os.path.abspath(os.path.join(root, file))

                # Skip the output file itself
                if file_path == output_path:
                    continue

                out.write(f"<{os.path.relpath(file_path)}>\n\n")
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        out.write(f.read())
                except Exception as e:
                    out.write(f"[Could not read file: {e}]")

                out.write("\n\n---\n\n")

    print(f"✅ Main files summary saved to {output_path}")

if __name__ == "__main__":
    generate_main_files_summary()