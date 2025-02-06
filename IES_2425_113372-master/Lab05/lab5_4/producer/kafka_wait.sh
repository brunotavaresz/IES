#!/bin/sh
# kafka_wait.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 $(echo $host | cut -d: -f1) $(echo $host | cut -d: -f2); do
  echo "Waiting for Kafka to be ready... "
  sleep 5
done

echo "Kafka is up - executing command"
exec $cmd