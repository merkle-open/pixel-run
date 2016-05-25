#!/bin/bash
# installer v1.2 by jbiasi (Namics AG)

# installation information
read -p "Choose your remote repository (github.com/namics/pixel-run):" remote
if [[ -z "$branch" ]]; then
    echo -e "Using default remote github.com/namics/pixel-run ...\n"
    let remote="github.com/namics/pixel-run"
fi
read -p "Which branch do you want to install? " branch
if [[ -z "$branch" ]]; then
    echo -e "Using default branch master ...\n"
    let branch="master"
fi

download_url="$remote/archive/$branch.zip"

# remove old directories if existing
rm -rf ./pixel-run

# download latest release from GitHub mirror
echo -e "\nDownloading application archive from $download_url (branch $branch) ...\n"
curl -L -o ./installer.zip $download_url

# extract zip and remove the old archive
echo -e "\nExctracting archive to Desktop ...\n"
unzip ./installer.zip -d ./repository; rm -rf __MACOSX
rm -f ./installer.zip

# copy the main repository content to the working directory
echo -e "\nCopying repository content to ~/Desktop/pixel-run ...\n"
cp -r "./repository/pixel-run-$branch" ./pixel-run
rm -rf ./repository

# go into the repository
cd ./pixel-run

# install dependencies
echo -e "\nInstalling dependencies ...\n"
npm install .
bower install .

# run the build process
echo -e "\nStarting build-process ...\n"
gulp build:bundle

# done
echo -e "\nInstallation done!\n"
exit 0
