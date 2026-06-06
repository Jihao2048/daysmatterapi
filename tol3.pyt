from pathlib import Path

def generate_icons_js(directory, output_file="icons.js", exclude_self=True):
    """
    读取目录下所有文件名并生成icons.js（使用正斜杠路径）
    """
    directory_path = Path("SVG")
    script_name = Path(__file__).name if exclude_self else None
    
    # 收集所有文件
    files = []
    
    for item in directory_path.iterdir():
        # 排除输出文件本身
        if item.name == output_file:
            continue
        
        # 排除程序本身
        if exclude_self and script_name and item.name == script_name:
            continue
        
        # 只处理文件，排除文件夹
        if item.is_file():
            files.append(item)
    
    # 按名称排序
    files.sort(key=lambda x: x.name)
    
    # 生成JavaScript内容
    js_content = "const icons = [\n"
    
    for idx, file in enumerate(files, start=1):
        # 将路径中的反斜杠替换为正斜杠
        file_path = str(file).replace('\\', '/')
        file_name = file.name
        
        # 转义单引号
        file_name_escaped = file_name.replace("'", "\\'")
        
        js_content += f"    {{number: {idx}, name: '{file_name_escaped}', path: '{file_path}'}},\n"
    
    js_content += "];\n\n"
    js_content += "// 导出模块\n"
    js_content += "if (typeof module !== 'undefined' && module.exports) {\n"
    js_content += "    module.exports = icons;\n"
    js_content += "}\n"
    
    # 写入文件
    output_path = directory_path / output_file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    return len(files), output_path

def main():
    script_dir = Path(__file__).parent
    
    print("=" * 60)
    print("生成 icons.js")
    print("=" * 60)
    print(f"工作目录: {script_dir}")
    print()
    
    try:
        count, output_path = generate_icons_js(script_dir)
        print(f"✓ 成功生成 {output_path.name}")
        print(f"✓ 共导出 {count} 个文件")
        
        # 显示生成的内容预览
        print("\n生成的内容预览:")
        print("-" * 60)
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
            print(content[:500])
            if len(content) > 500:
                print("...")
        
    except Exception as e:
        print(f"✗ 生成失败: {e}")

if __name__ == "__main__":
    main()