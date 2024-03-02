package com.cheering

import android.os.Build
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class AdjusterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "AdjusterModule"

    @ReactMethod
    fun setAdjustPan() {
        val activity = currentActivity ?: return
        activity.runOnUiThread { activity.window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN) }
    }

    @ReactMethod
    fun setAdjustResize() {
        val activity = currentActivity ?: return
        activity.runOnUiThread { activity.window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING) }
    }
}

