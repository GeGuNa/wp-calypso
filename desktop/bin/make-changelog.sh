#!/bin/bash

CALYPSO_DIR=$(cd $(dirname $0)/../../ && pwd)

# desktop tags
function get_desktop_tags() {
  desktop_tags=""
  declare -i x=0
  for tag in $(git tag); do
    # guard against stray v9.9.9 test tag that keeps being re-introduced to the repo! ಠ_ಠ
    if [[ "$tag" == *"9.9.9" ]]; then
      continue;
    fi

    if [[ $tag == desktop-v* ]]; then
      if [ $x -gt 0 ]; then
        desktop_tags="$desktop_tags"$'\n'"$tag"
      else
        desktop_tags="$tag"
      fi
    fi
    x+=1
  done
  echo "$desktop_tags"
}

# fetch all tags in descending lexicographical order
# (exclude current tag with `awk`)
all_tags=$(get_desktop_tags | tr - \~ | sort -V -r | tr \~ -)
tags=$all_tags
if [ ! -z "$VERSION" ]; then
  tags=$(echo "$all_tags" | awk '{if( !(/^'"$VERSION"'/) )print}')
fi

# get tag for previous stable release from the sorted list
# (first match without `-`, e.g. v1.2.3, not v1.2.3-alpha1)
last_stable_tag=$(for tag in $tags; do if [[ ! "$tag" == *"alpha"* && ! "$tag" == *"beta"* ]]; then
  echo "$tag"
  break
fi; done)

# get the current tag, fall back to HEAD
current_tag=$VERSION
if [ -z "$current_tag" ]; then
  current_tag=HEAD
fi

# Include commit message (%s). Other elements such as
# commit author (_%aN_) and commit short hash (%h) can
# be included if desired.
git_log_format="%s"

echo "## Latest Changes"
echo ""

# Fill and sort changelog (final sort in commit-date order)
git_log=$(git log --oneline --pretty=format:"$git_log_format" $last_stable_tag...$current_tag -- "$CALYPSO_DIR/desktop/" "$CALYPSO_DIR/client/lib/desktop-listeners" "$CALYPSO_DIR/client/desktop")

if [ ! -z "$git_log" ]; then
  echo "$git_log" | while IFS=$'\r' read change; do
    # Don't include application version bump commits
    awk '$0 !~ /([0-9])+\.([0-9])+\.([0-9])+/ {print "* " $0}' <<< $change
  done
else
  echo "No changes"
fi

printf "\n"
