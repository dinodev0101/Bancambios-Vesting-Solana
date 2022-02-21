FROM node:12.20.1-alpine AS build
ENV HOME /opt/srm-vesting-fe

ARG APP_ENV_ARG
ENV APP_ENV $APP_ENV_ARG

WORKDIR $HOME
COPY . $HOME/

RUN set -x && \
    apk add --no-cache --virtual \
    .gyp \
    git \
    rsync \
    python \
    autoconf \
    automake \
    make \
    g++ \
    zlib-dev \
    nasm

# yarn install
RUN set -x && \
    yarn install && \
    yarn --version && \
    yarn prebuild && \
    npm i -g npm && \
    npm --version && \
    yarn postbuild

# yarn build
RUN set -x && \
    cp $HOME/.env.$APP_ENV $HOME/.env && \
    cat $HOME/.env && \
    yarn build && \
    ls -la $HOME/build

FROM nginx:1.19
ENV HOME /opt/srm-vesting-fe
WORKDIR $HOME
COPY .build $HOME/.build
COPY --from=build /opt/srm-vesting-fe/build $HOME/build

RUN set -x && \
    rm -rf /etc/nginx/conf.d/default.conf && \
    cp $HOME/.build/.nginx/srm-vesting-fe.conf /etc/nginx/conf.d/srm-vesting-fe.conf && \
    nginx -t && \
    ls -la $HOME/build

STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
