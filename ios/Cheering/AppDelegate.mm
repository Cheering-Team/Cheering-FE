#import "AppDelegate.h"
#import "RNSplashScreen.h"
#import <Firebase.h>
#import <CodePush/CodePush.h>
#import <React/RCTBundleURLProvider.h>
#import <RNKakaoLogins.h>
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [application registerForRemoteNotifications];
  self.moduleName = @"Cheering";
  self.initialProps = @{};

  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];
  
  return YES;
}

- (void)application:(UIApplication *)application
 didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
 [FIRMessaging messaging].APNSToken = deviceToken;
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
  return [CodePush bundleURL];
#endif
}

@end
