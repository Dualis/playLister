A node.js app that allows users to convert local playlists to Youtube ones.

Running on http://playlistermsa.azurewebsites.net

How to use:
Upload a playlist using the form on the landing page.
(.m3u and plaintext work best, a sample file can be found here: https://puu.sh/rkEw7/38b9f99070.m3u)

You will be taken to another page where you can edit the playlist before submitting.
You need to authorise your youtube account using the link there as well.

The page then calls window.open() to direct you to the new playlist.
I've since added a link in case your browser has strict popup blocking.