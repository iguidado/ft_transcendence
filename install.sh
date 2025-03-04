#!/bin/bash

## Installation and configuration of docker, only use on personnal computer with sudo capability

# Add Docker's official GPG key:

OS=$(sudo cat /etc/os-release | grep PRETTY | cut -d'"' -f2 | cut -d' ' -f1 | tr [:upper:] [:lower:])

sudo apt-get update
sudo apt-get install ca-certificates curl -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/${OS}/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo   "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/${OS}   bookworm stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update


# Docker installation
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin git make -y


#Add user to docker groups to use docker rootless

USER=$(whoami)

sudo usermod -aG docker ${USER}
