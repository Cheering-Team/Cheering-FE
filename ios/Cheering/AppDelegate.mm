#import "AppDelegate.h"
#import "RNSplashScreen.h"
#import <Firebase.h>

#import <React/RCTBundleURLProvider.h>
#import <RNKakaoLogins.h>
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"Cheering";
  self.initialProps = @{};

  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];
  
  return YES;
}


- (BOOL)application:(UIApplication *)app
     openURL:(NSURL *)url
     options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  // naver
  if ([url.scheme isEqualToString:@"{{ CUSTOM URL SCHEME }}"]) {
      return [[NaverThirdPartyLoginConnection getSharedInstance] application:app openURL:url options:options];
    }

  // kakao
  if([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
      return [RNKakaoLogins handleOpenUrl: url];
  }
  return NO;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
