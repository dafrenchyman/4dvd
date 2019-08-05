#!/bin/bash
cd ..

# Check if running in CircleCI
if [ -z "${CIRCLE_BRANCH}" ]; then
  IN_CI=FALSE
else
  IN_CI=TRUE
fi

# Set CIRCLE_BRANCH if we're not running in CircleCI
if [ "${IN_CI}" == "FALSE" ]; then
    CIRCLE_BRANCH=`git rev-parse --abbrev-ref HEAD`
fi

# Build the branch
if [ "${CIRCLE_BRANCH}" == "master" ]; then
  ng build --env=prod
  COPY_PATH=""
else
  echo "Building branch: ${CIRCLE_BRANCH}"
  ng build --env=prod --deployUrl "/beta/${CIRCLE_BRANCH}/"
  COPY_PATH=beta/${CIRCLE_BRANCH}/
fi

# Copy to 4DVD
if [ "${IN_CI}" == "FALSE" ]; then
  # Use the pem file
  echo "Deploying to 4dvd.sdsu.edu/${COPY_PATH}"
  ssh -i ~/.ssh/ski-for-web.pem ubuntu@4dvd.sdsu.edu "mkdir -p /var/www/html/${COPY_PATH}"
  scp -i ~/.ssh/ski-for-web.pem -rp ./dist/* ubuntu@4dvd.sdsu.edu:/var/www/html/${COPY_PATH}
else
  echo "CircleCI deployment not yet setup"
fi
