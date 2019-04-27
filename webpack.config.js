var path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

var development = {
    entry: {
        sample: "./src/sample/index",
        vrm: ["@babel/polyfill", "./src/webar-vrm/index"]
    },
    output: {
        path: path.resolve(__dirname, "build/js"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    devtool: "inline-source-map"
    // target: "node"
};

var production = {
    mode: "production",
    entry: {
        sample: "./src/sample/index",
        vrm: ["@babel/polyfill", "./src/webar-vrm/index"]
    },
    output: {
        path: path.resolve(__dirname, "build/js"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        // new CopyWebpackPlugin([{ from: ".", to: ".", ignore: ["!*.css"] }], {
        //   context: "static/css"
        // }),
        new CopyWebpackPlugin(
            [
                { from: ".", to: ".", ignore: ["!*.dat"] },
                { from: ".", to: ".", ignore: ["!*.patt"] }
            ],
            {
                context: "static"
            }
        )
    ]
};

if ((process.env.NODE_ENV || "").trim() != "production") {
    console.log("NODE_ENV", "development");
    module.exports = development;
} else {
    console.log("NODE_ENV", "production");
    module.exports = production;
}
