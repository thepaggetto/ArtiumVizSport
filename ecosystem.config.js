module.exports = {
    apps: [
        {
            name: "artiumviz-boxe",
            script: "npm",
            args: "start",
            cwd: "/var/www/artiumviz-boxe",
            env: {
                NODE_ENV: "production",
                PORT: "3000"
            },
            instances: "max",
            exec_mode: "cluster"
        }
    ]
}