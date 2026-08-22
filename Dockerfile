FROM ubuntu:24.04

ARG USERNAME=codex
ARG USER_UID=1000
ARG USER_GID=1000

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        sudo \
        tar \
    && rm -rf /var/lib/apt/lists/*

# Vue/Viteの開発に使用するNode.js（LTS系）を導入する。
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - \
    && sudo apt-get install -y --no-install-recommends nodejs \
    && sudo npm install --global npm@latest \
    && sudo rm -rf /var/lib/apt/lists/*

# ホストの実行ユーザーとUID/GIDを合わせたユーザーを作成し、パスワード無しsudoを許可する。
# 指定のUID/GIDがベースイメージの既存ユーザー/グループと衝突する場合はリネームして流用する。
RUN set -eux; \
    if getent group "${USER_GID}" > /dev/null; then \
        groupmod -n "${USERNAME}" "$(getent group "${USER_GID}" | cut -d: -f1)"; \
    else \
        groupadd --gid "${USER_GID}" "${USERNAME}"; \
    fi; \
    if getent passwd "${USER_UID}" > /dev/null; then \
        usermod -l "${USERNAME}" -g "${USER_GID}" -d "/home/${USERNAME}" -m "$(getent passwd "${USER_UID}" | cut -d: -f1)"; \
    else \
        useradd --uid "${USER_UID}" --gid "${USER_GID}" -m -s /bin/bash "${USERNAME}"; \
    fi; \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/${USERNAME}"; \
    chmod 0440 "/etc/sudoers.d/${USERNAME}"

USER ${USERNAME}
ENV HOME=/home/${USERNAME} \
    PATH=/home/${USERNAME}/.local/bin:$PATH

RUN curl -fsSL https://chatgpt.com/codex/install.sh | sh

WORKDIR /workspace

CMD ["bash"]
