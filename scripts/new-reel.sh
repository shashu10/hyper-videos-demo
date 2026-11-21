#!/usr/bin/env bash
# Scaffold a self-contained 9:16 HyperFrames reel from a repo style system.
#
# Usage:
#   scripts/new-reel.sh model-launch --style ai
#   scripts/new-reel.sh model-launch --style ai --example kinetic-type

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: scripts/new-reel.sh <reel-name> [--style ai] [hyperframes-init flags...]" >&2
  exit 1
fi

NAME="$1"
shift

if [[ ! "${NAME}" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "error: reel name must use lowercase letters, numbers, and hyphens" >&2
  exit 1
fi

STYLE="ai"
INIT_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --style)
      if [[ $# -lt 2 ]]; then
        echo "error: --style requires ai" >&2
        exit 1
      fi
      STYLE="$2"
      shift 2
      ;;
    --style=*)
      STYLE="${1#--style=}"
      shift
      ;;
    *)
      INIT_ARGS+=("$1")
      shift
      ;;
  esac
done

case "${STYLE}" in
  ai|ai-release)
    COLLECTION="ai"
    SYSTEM="ai-release"
    ;;
  *)
    echo "error: unknown style '${STYLE}'; expected ai" >&2
    exit 1
    ;;
esac

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REELS_DIR="${REPO_ROOT}/reels/${COLLECTION}"
SYSTEM_DIR="${REPO_ROOT}/style-systems/${SYSTEM}"
TARGET="${REELS_DIR}/${NAME}"

if [[ -e "${TARGET}" ]]; then
  echo "error: ${TARGET} already exists" >&2
  exit 1
fi

mkdir -p "${REELS_DIR}"
cd "${REELS_DIR}"

DEFAULT_FLAGS=(
  --resolution=portrait
  --tailwind
  --non-interactive
  --example blank
)

USER_HAS_EXAMPLE=false
USER_HAS_RESOLUTION=false
# ${INIT_ARGS[@]+...} keeps an empty array safe under `set -u` on macOS Bash 3.2.
for arg in ${INIT_ARGS[@]+"${INIT_ARGS[@]}"}; do
  case "${arg}" in
    --example|--example=*|-e|-e=*) USER_HAS_EXAMPLE=true ;;
    --resolution|--resolution=*) USER_HAS_RESOLUTION=true ;;
  esac
done

FINAL_FLAGS=()
i=0
while [[ ${i} -lt ${#DEFAULT_FLAGS[@]} ]]; do
  flag="${DEFAULT_FLAGS[$i]}"
  case "${flag}" in
    --example)
      if ${USER_HAS_EXAMPLE}; then i=$((i + 2)); continue; fi
      FINAL_FLAGS+=("${DEFAULT_FLAGS[$i]}" "${DEFAULT_FLAGS[$((i + 1))]}")
      i=$((i + 2))
      ;;
    --resolution=*)
      if ${USER_HAS_RESOLUTION}; then i=$((i + 1)); continue; fi
      FINAL_FLAGS+=("${flag}")
      i=$((i + 1))
      ;;
    *)
      FINAL_FLAGS+=("${flag}")
      i=$((i + 1))
      ;;
  esac
done

set -x
npx --yes hyperframes@latest init "${NAME}" "${FINAL_FLAGS[@]}" ${INIT_ARGS[@]+"${INIT_ARGS[@]}"}
set +x

# Snapshot the selected system into the project. Reels remain reproducible when
# their source style system evolves; updates are always an explicit choice.
cp "${SYSTEM_DIR}/design.md" "${TARGET}/design.md"

for guide in frame.md voice.md; do
  if [[ -f "${SYSTEM_DIR}/${guide}" ]]; then
    cp "${SYSTEM_DIR}/${guide}" "${TARGET}/${guide}"
  fi
done

for directory in lib fonts assets; do
  if [[ -d "${SYSTEM_DIR}/${directory}" ]]; then
    mkdir -p "${TARGET}/${directory}"
    cp -R "${SYSTEM_DIR}/${directory}/." "${TARGET}/${directory}/"
  fi
done

printf '{\n  "collection": "%s",\n  "styleSystem": "%s",\n  "styleVersion": 1\n}\n' \
  "${COLLECTION}" "${SYSTEM}" > "${TARGET}/style.json"

echo "created ${TARGET} with the ${SYSTEM} style system"
echo "preview from repo root: npm run dev -- ${COLLECTION}/${NAME}"
