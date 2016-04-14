### Frequently Asked Questions

#### What should I do if the last player has been stucked in a trap?
Press <code>Ctrl + Y</code> or enter the browser console and write <code>Emergency.$quit()</code> to stop the game.

#### The scores don't synchronize with the game.
There's an interval of 10s in the sync-process. Wait at least for 10 seconds
and if the scores won't be synced in this time, talk to a techie.

#### I can't access the game by URL.
Be sure to use port 3000, for example <code>//game.play:3000</code> and be sure
you entered the right URL. If this won't fix the problem, talk to a techie.

#### The install script doesn't work.
Be sure you're connected to the internet, due the install script will download
the latest release from GitHub and install the dependencies via Bower and NPM over the network. If this won't fix the problem, talk to a techie.

#### The start script doesn't work.
Take a look at the error code written to the console by the server and read
the right chapter below.

**EACCES** You do not have the rights to start the server, try using the <code>sudo</code> command to start the server.

**ENOENT** Something has failed with the installation or something else, talk to a techie and show him/her the problem.

**ECONNREFUSED** No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host, talk to a techie.

**EADDRINUSE** The address is already in use, this means a server instance has already been started. Find the running task (Terminal Icon) and quit it by hitting <code>Ctrl + C</code> twice in the terminal console.

**ECONNRESET** A connection was forcibly closed by a peer. This normally results from a loss of the connection on the remote socket due to a timeout or reboot. Commonly encountered via the http and net modules, talk to a techie.

**EPERM** An attempt was made to perform an operation that requires elevated privileges. Try using <code>sudo</code> to start the server.

**ETIMEDOUT**
A connect or send request failed because the connected party did not properly respond after a period of time. Usually encountered by http or net -- often a sign that a socket.end() was not properly called, talk to a techie.
