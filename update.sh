#!/bin/bash
# updater v1.0 by jbiasi (Namics AG)

# installation information
read -p "Where's the project located to update (required)?" location
if [[ -z "$branch" ]]; then
    echo "You have to choose the project location first!"
    exit 1
fi

read -p "Choose your remote repository (github.com/namics/pixel-run):" remote
if [[ -z "$branch" ]]; then
    echo "Using default remote github.com/namics/pixel-run ..."
    let remote="github.com/namics/pixel-run"
fi

read -p "Which branch do you want to install? " branch
if [[ -z "$branch" ]]; then
    echo "Using default branch master ..."
    let branch="master"
fi

download_url="$remote/archive/$branch.zip"

# download latest release from GitHub mirror
echo -e "\nDownloading application archive from $download_url (branch $branch) ...\n"
curl -L -o ./upgrader.zip $download_url

# extract zip and remove the old archive
echo -e "\nExctracting archive to Desktop ...\n"
unzip ./upgrader.zip -d ./upgrade; rm -rf __MACOSX
rm -f ./upgrader.zip

# copy the main repository content to the working directory
echo -e "\nUpgrading repository content on $location ...\n"
rsync -av "./upgrade/pixel-run-$branch" $location
rm -rf ./upgrade

# go into the repository
cd $location

# install dependencies
echo -e "\nReinstalling dependencies ...\n"
npm install .
bower install .

# run the build process
echo -e "\nStarting build-process ...\n"
gulp build:bundle

# done
echo -e "\nInstallation done!\n"
exit 0
