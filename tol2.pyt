import re
from pathlib import Path

def modify_svg_color(svg_path, target_color="#9FB2C3"):
    """
    修改SVG文件的颜色为目标颜色
    
    Args:
        svg_path: SVG文件路径
        target_color: 目标颜色（默认#9FB2C3）
        
    Returns:
        是否成功
    """
    try:
        # 读取SVG文件内容
        with open(svg_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content  # 保存原内容用于比较
        
        # 定义颜色替换规则（按优先级排序）
        replacements = [
            # fill属性
            (r'fill="[^"]*"', f'fill="{target_color}"'),
            (r"fill='[^']*'", f"fill='{target_color}'"),
            (r'fill:\s*[^;"]*', f'fill:{target_color}'),
            
            # stroke属性
            (r'stroke="[^"]*"', f'stroke="{target_color}"'),
            (r"stroke='[^']*'", f"stroke='{target_color}'"),
            (r'stroke:\s*[^;"]*', f'stroke:{target_color}'),
            
            # color属性
            (r'color="[^"]*"', f'color="{target_color}"'),
            (r"color='[^']*'", f"color='{target_color}'"),
            
            # style属性中的颜色
            (r'style="([^"]*?)fill:\s*[^;"]*;?', f'style="\\1fill:{target_color};'),
            (r"style='([^']*?)fill:\s*[^;']*;?", f"style='\\1fill:{target_color};"),
        ]
        
        modified_content = content
        for pattern, replacement in replacements:
            modified_content = re.sub(pattern, replacement, modified_content)
        
        # 如果没有任何颜色属性被替换，在svg标签中添加fill
        if modified_content == original_content:
            # 在svg标签中添加fill属性
            modified_content = re.sub(
                r'(<svg\s+[^>]*?)>',
                f'\\1 fill="{target_color}">',
                modified_content
            )
        
        # 只有内容发生变化时才写入文件
        if modified_content != original_content:
            with open(svg_path, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            return True
        else:
            print(f"  未找到需要修改的颜色属性")
            return False
            
    except Exception as e:
        print(f"  错误: {e}")
        return False

def collect_svg_files(directory):
    """
    收集目录下所有SVG文件（包括子文件夹）
    
    Args:
        directory: 根目录路径
        
    Returns:
        SVG文件路径列表
    """
    svg_files = []
    directory_path = Path(directory)
    
    # 遍历所有子文件夹
    for svg_path in directory_path.rglob('*.svg'):
        svg_files.append(svg_path)
    for svg_path in directory_path.rglob('*.SVG'):
        if svg_path not in svg_files:
            svg_files.append(svg_path)
    
    return sorted(svg_files)  # 按首字母排序

def main():
    # 获取脚本所在目录
    script_dir = Path(__file__).parent
    target_color = "#9FB2C3"
    
    print("=" * 60)
    print("SVG颜色批量修改工具")
    print("=" * 60)
    print(f"工作目录: {script_dir}")
    print(f"目标颜色: {target_color}")
    print()
    
    # 收集所有SVG文件
    print("正在收集SVG文件...")
    svg_files = collect_svg_files(script_dir)
    
    if not svg_files:
        print("未找到SVG文件！")
        return
    
    print(f"找到 {len(svg_files)} 个SVG文件")
    print("-" * 60)
    
    # 修改每个SVG文件的颜色
    success_count = 0
    failed_files = []
    no_change_files = []
    
    for idx, svg_path in enumerate(svg_files, start=1):
        print(f"[{idx}/{len(svg_files)}] 处理: {svg_path.relative_to(script_dir)}")
        
        success = modify_svg_color(svg_path, target_color)
        
        if success:
            success_count += 1
            print(f"  ✓ 已修改颜色为 {target_color}")
        else:
            if "未找到" in str(success) if isinstance(success, bool) else False:
                no_change_files.append(svg_path)
                print(f"  ⚠ 未找到颜色属性，已添加fill属性")
            else:
                failed_files.append(svg_path)
                print(f"  ✗ 修改失败")
    
    # 输出统计信息
    print("-" * 60)
    print("修改完成！")
    print(f"成功: {success_count} 个")
    if no_change_files:
        print(f"已添加fill属性: {len(no_change_files)} 个")
    print(f"失败: {len(failed_files)} 个")
    
    if failed_files:
        print("\n失败的文件:")
        for file_path in failed_files:
            print(f"  - {file_path.relative_to(script_dir)}")
    
    print(f"\n所有SVG文件颜色已统一为: {target_color}")

if __name__ == "__main__":
    main()