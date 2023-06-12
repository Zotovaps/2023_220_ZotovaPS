#!/bin/bash
set -e
touch2() { mkdir -p "$(dirname "$1")" && touch "$1" ; }
RESPONSE=$(cat | jq -sc '.[0] // {}' | jq -c '.')

body=$(jq -cr '.body' <<< "$RESPONSE")

previous=$(jq -cr '.queryStringParameters.previous' <<< "$RESPONSE")
next=$(jq -cr '.queryStringParameters.next' <<< "$RESPONSE")

cd /tmp
touch2 $next

echo $previous >&2
echo $next >&2

if [ -z "$previous" ]
then
      echo -n "$body" > $next
else 
      aws --endpoint-url=$endpoint_url s3 mv s3://$bucket_id/$previous $previous >&2
      echo -n "$body" >> $previous
      mv $previous $next
fi

aws --endpoint-url=$endpoint_url s3 mv $next s3://$bucket_id/$next >&2

# cat $next >&2

# echo $RESPONSE >&2

echo $RESPONSE | jq -c '{statusCode:200, body:{request:.queryStringParameters}}'

