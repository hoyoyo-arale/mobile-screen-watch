#!/usr/bin/env bash
# ホストの UID/GID を取得し、コンテナ内ユーザーに反映させた上で
# docker compose を実行するラッパー。
#
# 使い方:
#   ./run.sh [--name|-n CONTAINER_NAME] <docker compose のサブコマンド...>
#
# --name/-n はオプション。指定するとコンテナ名(compose.yaml の container_name)を
# 上書きできる。複数プロジェクトで同時にコンテナを起動する場合などに使う。
# 例:
#   ./run.sh build
#   ./run.sh run --rm codex bash
#   ./run.sh --name myproj-codex up -d
set -euo pipefail

export USER_UID="$(id -u)"
export USER_GID="$(id -g)"
export USERNAME="${USERNAME:-codex}"
CONTAINER_NAME="${CONTAINER_NAME:-codex}"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --name|-n)
            CONTAINER_NAME="$2"
            shift 2
            ;;
        --name=*)
            CONTAINER_NAME="${1#*=}"
            shift
            ;;
        *)
            break
            ;;
    esac
done
export CONTAINER_NAME

cd "$(dirname "${BASH_SOURCE[0]}")"

if docker compose version >/dev/null 2>&1; then
    exec docker compose "$@"
else
    exec docker-compose "$@"
fi
