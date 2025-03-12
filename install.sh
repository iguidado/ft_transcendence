#!/bin/bash

## Installation and configuration of stack dependecy, only use on account with sudo capability (not root !)

install-curl() {
if ! which curl &> /dev/null
then
	if [[ "$OS" == "debian" || "$OS" == "ubuntu" ]]
	then
		sudo apt install curl
	elif [ "$OS" == "fedora" ]
	then
		sudo dnf install curl
	fi
fi
}

install-docker() {
	if ! which docker &> /dev/null
	then
		# Add Docker's official GPG key:


		sudo apt-get update
		sudo apt-get install ca-certificates curl -y
		sudo install -m 0755 -d /etc/apt/keyrings
		sudo curl -fsSL https://download.docker.com/linux/${OS}/gpg \
		       	-o /etc/apt/keyrings/docker.asc
		sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:

	echo   "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] \
		https://download.docker.com/linux/${OS}   bookworm stable"  \
		|   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
		sudo apt-get update


# Docker installation
	sudo apt-get install docker-ce docker-ce-cli containerd.io \
		docker-buildx-plugin docker-compose-plugin git make -y
	else
			echo "Docker already installed"
	fi
}


docker-conf() {

	#Add user to docker groups to use docker rootless

	if ! groups | grep docker &> /dev/null
	then
		USER=$(whoami)
		sudo usermod -aG docker ${USER}
		echo "Added current  user to docker group to use docker rootless"
	else
		echo "User already configured for rootless docker"
	fi
}

install-npm() {

if ! (which node &> /dev/null && which npm &> /dev/null)
then
	if [[ "${OS}" == "debian" || ${OS} == "ubuntu" ]]
	then
		curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
		sudo apt update
		sudo apt install nodejs -y
	elif [  "${OS}" == "fedora" ]
	then
		sudo dnf install -y nodejs
	else
		echo "Our installation of NPM is not supported for this distribution. \
			You need to install it yourself"
	fi
else
	echo "NodeJs and/or NPM already install"
fi

}


# Detect the distribution
if [ -f /etc/os-release ]; then
	. /etc/os-release
	OS=$ID
else
	echo "Unsupported OS"
	exit 1
fi

## keeping this line as a fallback if os-release is unreliable as an executable
#OS=$(sudo cat /etc/os-release | grep PRETTY | cut -d'"' -f2 | cut -d' ' -f1 | tr [:upper:] [:lower:])

install-curl
install-docker
docker-conf
install-npm
