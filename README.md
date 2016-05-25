## Installer

> **Note:** This script is a shell script and can only be executed on newer windows devices or
every device which internally supports shell scripts.

```bash
chmod 777 install.sh && ./install.sh

# > Choose your remote repository ...:
# $ Using default github.com/namics/pixel-run

# > Which branch do you want to ...:
# $ Using default branch master
```

## Updater

> **Note:** If you're planning to run the updater on windows, you'll need [Cygwin](http://www.cygwin.com/)
to execute the script because it needs <code>rsync</code>

```bash
chmod 777 update.sh && ./update.sh

# > Where's the project located?:
# $ ./pixel-run-clone

# > Where should the update be taken from?:
# $ Using default github.com/namics/pixel-run

# > Which branch should be used?:
# $ Using default branch master 
```
