declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN?: string
      NODE_ENV?: 'development' | 'production'
      PORT?: string
      PWD?: string
      FASTIFY_CLOSE_GRACE_DELAY?: string
      JWT_SECRET?: string

      MYSQL_PORT?: string
      MYSQL_HOST?: string
      MYSQL_DB?: string
      MYSQL_USER?: string
      MYSQL_PASSWORD?: string

      EMAIL_HOST?: string
      EMAIL_PORT?: string
      EMAIL_USER?: string
      EMAIL_PASS?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
// export {}
