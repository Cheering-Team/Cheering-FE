-keep class com.stardium.BuildConfig { *; }

# kakao login
-keep class com.kakao.sdk.**.model.* { <fields>; }

-keep public class com.navercorp.nid.** { *; }

# With R8 full mode generic signatures are stripped for classes that are not 
# kept. Suspend functions are wrapped in continuations where the type argument 
# is used. 
-keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation 
  
# R8 full mode strips generic signatures from return types if not kept. 
-if interface * { @retrofit2.http.* public *** *(...); } 
-keep,allowoptimization,allowshrinking,allowobfuscation class <3> 
  
# With R8 full mode generic signatures are stripped for classes that are not kept. 
-keep,allowobfuscation,allowshrinking class retrofit2.Response 

# date picker
-keep class net.time4j.** { *; }