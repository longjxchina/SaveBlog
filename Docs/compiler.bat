cd ../src

java -jar "C:\Documents and Settings\Administrator\My Documents\Downloads\compiler-latest\compiler.jar" --compilation_level SIMPLE_OPTIMIZATIONS  --js Scripts/rangy-core.js --js Scripts/jquery-1.9.1.min.js --js Scripts/GlobalStorage.js --js Scripts/main.js --js_output_file publish/Scripts/main.min.js

pause

java -jar "C:\Documents and Settings\Administrator\My Documents\Downloads\compiler-latest\compiler.jar" --compilation_level SIMPLE_OPTIMIZATIONS  --js Scripts/background.js --js_output_file publish/Scripts/background.min.js

pause