# Path to this plugin
export PROTOC_GEN_TS_PATH=./js/node_modules/.bin/protoc-gen-ts
# Path to the grpc_node_plugin
export PROTOC_GEN_GRPC_PATH=./js/node_modules/.bin/grpc_tools_node_protoc_plugin
# Directory to write generated code to (.js and .d.ts files)
JS_OUT_DIR="./js/generated"
PY_OUT_DIR="./hack_chatgpt/generated"

ts:
	mkdir -p ${JS_OUT_DIR}
	/opt/homebrew/bin/protoc  --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" --plugin="protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH}"  --js_out="import_style=commonjs,binary:${JS_OUT_DIR}" --ts_out="${JS_OUT_DIR}"  --grpc_out="grpc_js:${JS_OUT_DIR}"  proto/chatgpt.proto
	
pyy:
	mkdir -p ${PY_OUT_DIR}
	python -m grpc_tools.protoc -I .  --python_out=${PY_OUT_DIR} --grpc_python_out=${PY_OUT_DIR} proto/chatgpt.proto && echo "success generated"