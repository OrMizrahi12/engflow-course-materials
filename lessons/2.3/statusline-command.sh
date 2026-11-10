#!/bin/bash
input=$(cat)
model=$(echo "$input" | jq -r '.model.display_name // "?"')
tokens=$(echo "$input" | jq -r '.context_window.total_input_tokens // 0')
pct=$(echo "$input" | jq -r '.context_window.used_percentage // 0')

# Bar: 10 blocks, full at 150k tokens
filled=$(( tokens * 10 / 150000 ))
[ "$filled" -gt 10 ] && filled=10
bar=""
for i in $(seq 1 10); do
  if [ "$i" -le "$filled" ]; then bar="${bar}█"; else bar="${bar}░"; fi
done

printf '%s | %sk (%.0f%%) %s' "$model" "$(awk -v t="$tokens" 'BEGIN{printf "%.1f", t/1000}')" "$pct" "$bar"
