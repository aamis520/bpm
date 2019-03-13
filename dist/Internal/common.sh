

#读取对应的配置文件的内容
#$1为配置文件名
#$2为对应的配置key名
function fReadConfig()
{
	file=$1
	item=$2
	section='config'
	val=$(awk -F '=' '/\['${section}'\]/{a=1} (a==1 && "'${item}'"==$1){a=0;print $2}' ${file})
	echo "$val"
}

#压缩目录, $1为对应的目录名，$2为压缩后的位置和文件名。
function fZipFolder()
{
	path=$1
	dest=$2
	echo tar -cvf $dest $path
	$(tar -cf $dest $path)
	return 0;
}

#解压，$1为文件名，$2为相应的位置。
function fUnZipTo()
{
	echo "fUnZipTo"
	return 0;
}

#将某个数据库整体导出
function exportDB()
{
	echo "exportDB"
	return 0;
}

#将某个数据库整体导入
function importDB()
{
	echo "importDB"
	return 0;
}

#删除传入的DB
function deleteDB()
{
	echo "deleteDB"
	return 0;
}

# 全部替换文件中对应的内容
# $1为文件名； $2为原内容；$3为需要替换的内容
function fileReplace()
{
	target=$1
	source=$2
	file=$3
	$(sed -i 's/$source/$target/' $file)
	return 0;
}

# 将文件备份
function fileBak()
{
	file=$1
	$(\cp -fr $file ${file}.bak)
	return 0
}

# 恢复备份文件
function fileRestore()
{
	file=$1
	$(\cp -fr ${file}.bak $file)
	$(\rm -f ${file}.bak)
	return 0
}

# 调用外部命令
function callExternal()
{
	$($1)
	return 0;
}


#在linux下建立命令的软链接
function mklink()
{
	echo "mklink"
	return 0;
}