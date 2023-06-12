#!/bin/bash
set -e

RESPONSE=$(cat | jq -sc '.[0] // {}' | jq -c '.')

bucket_id=$(jq -cr '.messages[0].details.bucket_id' <<< "$RESPONSE")
object_id=$(jq -cr '.messages[0].details.object_id' <<< "$RESPONSE")

target=$(jq -cr '.queryStringParameters.target' <<< "$RESPONSE")

# echo $RESPONSE >&2

cd /tmp

echo $target >&2
echo $bucket_id >&2
echo $object_id >&2


if [ "$target" == "null" ]
then
    aws --endpoint-url=$endpoint_url s3 cp s3://$bucket_id/$object_id /$object_id

    gzip /$object_id

    aws --endpoint-url=$endpoint_url s3 mv /$object_id.gz s3://$bucket_id/$object_id.gz

    echo $RESPONSE >&2

    echo $RESPONSE | jq -c '{statusCode:200, body:{request:.}}'
else 

    aws --endpoint-url=$endpoint_url s3 cp s3://$bucket_name/$target.gz /tmp/$target.gz >&2

    gzip -d ./$target.gz >&2

    aws --endpoint-url=$endpoint_url s3 mv ./$target s3://$bucket_name/$target >&2

    echo $RESPONSE >&2

    path="https://d5duqpi9k7db8o1dj509.apigw.yandexcloud.net/static/upload/${target}"

    echo '{
        "statusCode": 200,
        "body": "'"${path}"'"
    }'

fi
