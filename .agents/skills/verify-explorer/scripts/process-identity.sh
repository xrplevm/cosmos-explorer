# A PID can outlive the process it originally identified. Next.js changes
# its process title at startup, so identify the process by its start time.
process_identity() {
  local pid="$1" stat boot_id
  [[ "$pid" =~ ^[1-9][0-9]*$ && "$pid" != 1 ]] || return 1

  if [ -r /proc/sys/kernel/random/boot_id ]; then
    local -a fields
    IFS= read -r boot_id < /proc/sys/kernel/random/boot_id || return 1
    IFS= read -r stat 2>/dev/null < "/proc/$pid/stat" || return 1
    # Skip the executable name, which can contain spaces or parentheses.
    read -r -a fields <<< "${stat##*) }"
    [[ "${fields[0]:-Z}" != Z && -n "${fields[19]:-}" ]] || return 1
    printf '%s:%s\n' "$boot_id" "${fields[19]}"
  else
    LC_ALL=C TZ=UTC0 ps -p "$pid" -o lstart=
  fi
}

same_process() {
  local identity
  [[ -n "$2" ]] && identity=$(process_identity "$1") && [[ "$identity" == "$2" ]]
}
