#!/bin/bash

source config.sh

SHORTCODE=$1
DEST=$2

if [[ -z $DEST ]]
then
  echo "Usage: $0 [short-code] [dest-url]"
  exit;
fi

# Call curl command with all the info to create a new redirect
curl https://jsonbox.io/${BOXID}/${SHORTCODE} -H 'content-type: application/json' --data-binary '{"dest": "'${DEST}'"}'
