#!/bin/sh

set -eu

OUTPUT_JSON=pages/titles.json

./fetch_rss update --output "$OUTPUT_JSON"
