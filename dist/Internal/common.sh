

#��ȡ��Ӧ�������ļ�������
#$1Ϊ�����ļ���
#$2Ϊ��Ӧ������key��
function fReadConfig()
{
	file=$1
	item=$2
	section='config'
	val=$(awk -F '=' '/\['${section}'\]/{a=1} (a==1 && "'${item}'"==$1){a=0;print $2}' ${file})
	echo "$val"
}

#ѹ��Ŀ¼, $1Ϊ��Ӧ��Ŀ¼����$2Ϊѹ�����λ�ú��ļ�����
function fZipFolder()
{
	path=$1
	dest=$2
	echo tar -cvf $dest $path
	$(tar -cf $dest $path)
	return 0;
}

#��ѹ��$1Ϊ�ļ�����$2Ϊ��Ӧ��λ�á�
function fUnZipTo()
{
	echo "fUnZipTo"
	return 0;
}

#��ĳ�����ݿ����嵼��
function exportDB()
{
	echo "exportDB"
	return 0;
}

#��ĳ�����ݿ����嵼��
function importDB()
{
	echo "importDB"
	return 0;
}

#ɾ�������DB
function deleteDB()
{
	echo "deleteDB"
	return 0;
}

# ȫ���滻�ļ��ж�Ӧ������
# $1Ϊ�ļ����� $2Ϊԭ���ݣ�$3Ϊ��Ҫ�滻������
function fileReplace()
{
	target=$1
	source=$2
	file=$3
	$(sed -i 's/$source/$target/' $file)
	return 0;
}

# ���ļ�����
function fileBak()
{
	file=$1
	$(\cp -fr $file ${file}.bak)
	return 0
}

# �ָ������ļ�
function fileRestore()
{
	file=$1
	$(\cp -fr ${file}.bak $file)
	$(\rm -f ${file}.bak)
	return 0
}

# �����ⲿ����
function callExternal()
{
	$($1)
	return 0;
}


#��linux�½��������������
function mklink()
{
	echo "mklink"
	return 0;
}