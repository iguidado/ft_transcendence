#!/usr/bin/env python3

from beverage import HotBeverage, Coffee, Tea, Cappuccino, Chocolate
import random

class CoffeeMachine:
	def __init__(self):
		self.CupCount = 10

	class EmptyCup(HotBeverage):
		def __init__(self) :
			self.name = "empty cup"
			self.price = 0.90

		def description(self):
			return "An empty cup?! Gimme my money back!"
		
	class BrokenMachineException(Exception):
		def __init__(self):
			self.message = "This coffee machine has to be repaired."
			super().__init__(self.message)
	
	def repair(self):
		self.count = 10

	def serve(self, drink : HotBeverage):
		if self.CupCount <= 0:
			raise self.BrokenMachineException
		self.CupCount -=1
		if random.choice([True, False]):
			return drink()
		else:
			return self.EmptyCup()

def main():
	coffeeMachine = CoffeeMachine()
	for _ in range(23):
		try:
			print(coffeeMachine.serve(random.choice([Coffee, Tea, Cappuccino, Chocolate])))
		except CoffeeMachine.BrokenMachineException as e:
			print(e)
			coffeeMachine.repair()

if __name__ == '__main__':
    main()