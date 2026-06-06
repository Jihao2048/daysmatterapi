from pathlib import Path

def delete_non_svg_in_subfolders(directory):
    """
    只删除子文件夹内的非SVG文件（保留根目录下的所有文件）
    
    Args:
        directory: 根目录路径
        
    Returns:
        删除的文件列表
    """
    deleted_files = []
    directory_path = Path(directory)
    
    # 遍历所有子文件夹（不包括根目录）
    for item in directory_path.iterdir():
        if item.is_dir():  # 只处理子文件夹
            print(f"\n扫描子文件夹: {item.name}")
            # 遍历子文件夹内的所有文件
            for file_path in item.rglob('*'):
                if file_path.is_file():  # 只处理文件
                    # 检查文件扩展名（不区分大小写）
                    if file_path.suffix.lower() != '.svg':
                        try:
                            file_path.unlink()  # 删除文件
                            print(f"  [删除] 已删除: {file_path.name}")
                            deleted_files.append(str(file_path))
                        except Exception as e:
                            print(f"  [错误] 删除失败 {file_path.name}: {e}")
    
    return deleted_files
def main():
    # 获取脚本所在目录
    script_dir = Path(__file__).parent
    
    print("=" * 60)
    print("子文件夹非SVG文件删除工具（自动删除模式）")
    print("=" * 60)
    print(f"工作目录: {script_dir}")
    print("注意: 只删除子文件夹内的文件，根目录下的文件不受影响")
    print()
    print("开始删除...")
    print("-" * 60)
    
    # 直接删除，无需确认
    deleted_files = delete_non_svg_in_subfolders(script_dir)
    
    print("-" * 60)
    print(f"删除完成！共删除 {len(deleted_files)} 个文件")

if __name__ == "__main__":
    main()