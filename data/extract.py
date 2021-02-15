import re

remove_discriptors = re.compile(r'(>.*)?\n')

path = re.sub(r'/[^//]+$', '', __file__.replace('\\', '/')) 

# data_size = 3 * 10_000_000
data_size = 3 * 10_000
data = ''
temp_store = ''

with open(path+ '/genomic.fna', 'r') as f:
    data = remove_discriptors.sub('', f.read(data_size))

with open(path + '/data','w') as f:
    f.write(data)
