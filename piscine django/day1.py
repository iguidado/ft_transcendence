#!/usr/bin/env python3
# -----------------------EX00--------------------------#
# def my_var():
#     variables = [
#         42,  # int
#         "42",  # str
#         "quarante-deux",  # str
#         42.0,  # float
#         True,  # bool
#         [42],  # list
#         {42: 42},  # dict
#         (42,),  # tuple
#         set()  # set
#     ]
#     for var in variables:
#         print(var," est de type ", type(var))
# if __name__ == "__main__":
# 	main()
# -----------------------EX01--------------------------#
# def open_file():
#     files = open("number.txt", 'r')
#     for line in files.readlines():
#         nodes = line.split(",")
#         for node in nodes:
#             print(node)
#     files.close();
# if __name__ == "__main__":
# 	main()
# -----------------------EX02--------------------------#
# def dico():
#     d = [
#         ('Hendrix' , '1942'),
#         ('Allman' , '1946'),
#         ('King' , '1925'),
#         ('Clapton' , '1945'),
#         ('Johnson' , '1911'),
#         ('Berry' , '1926'),
#         ('Vaughan' , '1954'),
#         ('Cooder' , '1947'),
#         ('Page' , '1944'),
#         ('Richards' , '1943'),
#         ('Hammett' , '1962'),
#         ('Cobain' , '1967'),
#         ('Garcia' , '1942'),
#         ('Beck' , '1944'),
#         ('Santana' , '1947'),
#         ('Ramone' , '1948'),
#         ('White' , '1975'),
#         ('Frusciante', '1970'),
#         ('Thompson' , '1949'),
#         ('Burton' , '1939')
# ]
#     dict = {}
#     for value, key in d:
#         dict[key] = value
	
#     for key, item in dict.items():
#         print(key, ":", item)
# if __name__ == "__main__":
# 	main()
# -----------------------EX03--------------------------#
# import sys    
# def capital_city(key : str):
# 	states = {
# 		"Oregon" : "OR",
# 		"Alabama" : "AL",
# 		"New Jersey": "NJ",
# 		"Colorado" : "CO"
# 	}
# 	capital_cities = {
# 		"OR": "Salem",
# 		"AL": "Montgomery",
# 		"NJ": "Trenton",
# 		"CO": "Denver"
# 	}
# 	key = states.get(key)
# 	if not key:
# 		print("Unknow state")
# 		return
# 	print(capital_cities[key])
# def main():
# 		if len(sys.argv) == 2:
# 			capital_city(sys.argv[1])
# if __name__ == "__main__":
# 	main()
# -----------------------EX04--------------------------#
# import sys    
# def searchByDictKey(dict : dict, value):
# 	for key, item in dict.items():
# 		if item == value:
# 			return key
# 	return None
# def capital_city(value : str):
# 	states = {
# 		"Oregon" : "OR",
# 		"Alabama" : "AL",
# 		"New Jersey": "NJ",
# 		"Colorado" : "CO"
# 	}
# 	capital_cities = {
# 		"OR": "Salem",
# 		"AL": "Montgomery",
# 		"NJ": "Trenton",
# 		"CO": "Denver"
# 	}
# 	value = searchByDictKey(capital_cities, value)
# 	if not value:
# 		print("Unknown capital city")
# 		return
# 	print(searchByDictKey(states, value))
# def main():
# 		if len(sys.argv) == 2:
# 			capital_city(sys.argv[1])
# if __name__ == "__main__":
# 	main()
# -----------------------EX05--------------------------#
# import sys    
# def searchByDictKey(dict : dict, value):
# 	for key, item in dict.items():
# 		if item == value:
# 			return key
# 	return None
# def stateDico(key : str):
# 	states = {
# 		"Oregon" : "OR",
# 		"Alabama" : "AL",
# 		"New Jersey": "NJ",
# 		"Colorado" : "CO"
# 	}
# 	capital_cities = {
# 		"OR": "Salem",
# 		"AL": "Montgomery",
# 		"NJ": "Trenton",
# 		"CO": "Denver"
# 	}
	
# 	res = searchByDictKey(capital_cities, key)
# 	if res:
# 		print(key, "is the capital of", searchByDictKey(states, res))
# 		return
# 	res = states.get(key)
# 	if res:
# 		print(capital_cities[res], "is the capital of", key)
# 		return
# 	print(key, "is neither a capital city nor a state")
# def main():
# 		if len(sys.argv) == 2:
# 			nodes = [node.strip().title() for node in sys.argv[1].split(", ") if node]
# 			for node in nodes:
# 				stateDico(node)
# if __name__ == "__main__":
# 	main()
# -----------------------EX06--------------------------#
# def dictSort(dico : dict):
# 	dico = dict(sorted(dico.items(), key=lambda item: (item[1], item[0])))
# 	return dico
# def main():
# 	d = {
# 		'Santana' : '1947',
# 		'Hendrix' : '1942',
# 		'Allman' : '1946',
# 		'King' : '1925',
# 		'Clapton' : '1945',
# 		'Johnson' : '1911',
# 		'Berry' : '1926',
# 		'Vaughan' : '1954',
# 		'Cooder' : '1947',
# 		'Page' : '1944',
# 		'Richards' : '1943',
# 		'Hammett' : '1962',
# 		'Cobain' : '1967',
# 		'Garcia' : '1942',
# 		'Beck' : '1944',
# 		'Ramone' : '1948',
# 		'White' : '1975',
# 		'Frusciante': '1970',
# 		'Thompson' : '1949',
# 		'Burton' : '1939',
# 	}
# 	d = dictSort(d)
# 	for key, value in d.items():
# 		print(key)
    
# if __name__ == "__main__":
# 	main()
# -----------------------EX07--------------------------#