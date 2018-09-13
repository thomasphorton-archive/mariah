## Provisioning a new RPi

# find Pi's local IP address
# `ssh pi@<ip>`
# default pi password: `raspberry`

## Once connected
# Run the password configuration tool:
psswd

# Update environment
sudo apt-get update -y
sudo apt-get dist-upgrade -y

sudo pip install --upgrade pip
pip install awscli --upgrade --user

# Install ZSH
sudo apt install zsh

# Install Oh-my-Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# Install node 8.x
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs npm node-semver

# Clone Mariah package
git clone https://github.com/thomasphorton/mariah.git

# Install Mariah dependencies
cd "./mariah"
npm install

# Copy config file
cp config.js.example ./config.js

# Create an IAM user for the Pi
# Add user to Mariah-Devices group
# Configure AWS CLI with this user

# In AWS IoT Core Console, go to 'onboard' and follow the wizard.
# Platform: Linux/OSX
# IoT Device SDK: Node.js

# Choose a thing: existing thing-> mariah
# Download connection kit
