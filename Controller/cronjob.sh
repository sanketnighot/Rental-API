 #!/bin/bash

export totalRewardIds=$(node getRewardId.js)

b=2
echo $totalRewardIds
a=$((totalRewardIds / 5))

echo $a
echo "Bash version ${BASH_VERSION}..."
for (( i=1; i<=$totalRewardIds; i+=5 ))
do 
  pm2 -f start updateRewards.js -- $i --instances $i  --cron "* * * * *" --name "updateRewards$i"
done