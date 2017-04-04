#!/bin/bash
cd ~/src/wordpress/wp-content/plugins/beakon-invoice/js
yarn build
cd ../
cp -aRv ./ ~/src/beakon-invoice
cd ~/src/beakon-invoice
rm -rf ./backend/
rm -rf ./.git/
rm -rf ./js/node_modules/
zip -r ~/src/beakon-invoices.zip ./
