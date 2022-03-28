# Unmineable Multi-Miner

## Introduction

## What It Does
Multi-Miner makes it easy to mine many coins with Unmineable.  It takes care of installing the miner software you want automatically.  When run it alternte between each configured coin in a randomized round-robin fashion.  This lets you mine different coins while prioritizing one coin over another.  For example, if you wanted to mine ETH 75% of the time and SHIB 25% of the time Multi-Miner can be configured to run ETH in 18 hour time slices while SHIB for 6 hour time slices.  Any coin can be configured to run for any length of time (minimum 1 hour) and there is no limit to the number of coins that can be configured.

## Why We Made It
Originally Multi-Miner was written as a collection of PowerShell scripts to alternate between mining different altcoins on Unmineable.  Given the speculative nature of mining alt-coins we wanted to allow users to "diversify" their mining efforts by mining multiple coins and prioritizing which coins to favor.  Setting up multiple `.bat` files to run mining software with different configurations and alternating between them is clunky and prone to error.  It's also a lot of work for the users since they need to download the mining software and ensure that it is kept up-to-date.  An (unreleased) set of PowerShell scripts were developed to allow automatic coin switching, but was limited feature-wise and not very user-friendly.  Additionally we wanted Multi-Miner to be more transparent than the application distributed by Unmineable's website, which is a front-end for `XMRig` (CPU) and `PhoenixMiner` (GPU).  In addition to being open-source, Multi-Miner has many more features and provides the users with much more information about what it's doing behind the scenes.

## Getting Started
Getting started with Multi-Miner is easy!  Once installed there are only three steps to get going.
1. Configure a wallet(s).
2. Enable the coins you want to mine.
3. Start the miner.

### Installation
Multi-Miner is programmed using [Electron](https://www.electronjs.org/) and runs on Windows platforms.  To install simply run the installer in the releases section.

### Configuring a Wallet
The first step is to configure a wallet to use.  Click on the `Wallets` link on the left hand navigation and click `ADD WALLET`.

![image](https://user-images.githubusercontent.com/5205466/160330956-41d2f68a-2c2a-4caa-92ed-dfcd496c489d.png)

The following options are available:  
|Field|Required|Description|  
|-----|--------|-----------|  
|Name|Yes|A friendly name for the wallet.|
|Blockchain|Yes|The blockchain that this wallet is associated with.  This determines which coins can be mined using it.|
|Address|Yes|The address of the wallet.  Multi-Miner will automatically syntax-check this to ensure that it is a valid address for the configured blockchain.|
|Memo|No|An optional memo for the address.  This is only needed when mining certain coins to an exchange.|

* Note.  You can create as many wallets as you want targetting as many blockchains as you want.
* Note.  It is not possible to delete wallets if any coins are configured to use them.

### Configuring Coins
To configure a coin, click on the `Coins` link on the left hand navigation.  Find the coin in the list and click the pencil icon next to it to open up the editor.

![image](https://user-images.githubusercontent.com/5205466/160332429-a7c2c9f8-6e4b-4b36-a6c1-5bc5b91ce7c8.png)

The following fields are available:
|Field|Required|Description|  
|-----|--------|-----------|
|Enabled|No|Toggle to enable mining this coin.|
|Wallet|Yes|The wallet to mine this coin to.|
|Duration (in hours)|Yes|The length of time to mine this coin before switching to another one.|

#### What about referral codes?
Referral codes for each coin are baked into the application and are used to help support this software.  There is no need to configure them.  Any mining will always have the 0.25% donation reduction applied.

### Configuring Miners (optional)
By default Multi-Miner is configured to use [lolMiner](https://lolminer.site/) with its default settings so there is no need modify them.  To add or modify miners, clck on the `Miners` navigation clink.  From here you can add new miners or modify existing ones.

![image](https://user-images.githubusercontent.com/5205466/160333726-32ae1161-bcd0-4a68-a7a7-bc118fb25a96.png)

The following fields are available:
|Field|Required|Description|  
|-----|--------|-----------|
|Enabled|No|Allow this miner to be selected as the default miner to use.|
|Name|Yes|A friendly name for the miner.|
|Miner|Yes|The name of the mining application to use.|
|Version|Yes|The version of the mining application to use.  Multi-Miner will populate this list with the previous 10 versions of the application.|
|Algorithm|Yes|Which algorithm to mine with if the application supports more than one.|
|Parameters|No|Additional parameters to add to the command line.  Please see the configured miner's documentation for more information.|

:warning: Multi-Miner does not validate additional parameters, so use caution when configuring things such as overclocking or fan speeds.  
:information_source: Multi-Miner will automatically download the mining software selected.  There is no need to manually install it.  
:stop_sign: Windows will frequently identify mining software as malware and prompt for confirmation.  This is normal.  

### Configure General Settings (optional)
This screen allows global settings related to Unmineable to adjusted.  With the exception of `Proxy Server` these settings should not need to be adjusted.
* Note.  If you are having trouble getting network status updated and seeing errors in the logs you can configure the `Proxy Server` setting.  Multi-Miner supports both HTTP and SOCKS proxy servers.

## Running The Miner
To begin mining, navigate to the `Home` screen and click on `START MINER` from the top of the screen.  Additionally, the configured miner can be started/stopped by clicking on the :arrow_forward: button on the bottom-right hand size of the screen.  After a couple of seconds the screen will start to begin to populate with statistics from the mining application.

![image](https://user-images.githubusercontent.com/5205466/160339231-ec8cfd6e-9ea7-4704-a0cc-e9b0a814bf44.png)

* Note.  It may take several minutes before the graphs begin to populate with information.  

### The Monitor Screen
You can also view the raw output from the configured miner by navigating to the `Monitor` screen.  From here, the `STDOUT` from the mining application will be continuously streamed.  This screen can also be used to troubleshoot any configuration issues with the miner.

## Supported Miners
Currently Multi-Miner only supports [lolMiner](https://lolminer.site/), however additional miner support is in the works and is expected to be made available shortly.  See the table below for more information.  
|Miner|Type|Supported|Expected Release|  
|-----|----|---------|----------------|  
|lolMiner|GPU|:ballot_box_with_check:|1.0|
|NBMiner|GPU|:x:|2.0|
|PhoenixMiner|GPU|:x:|2.0|
|T-Rex Miner|GPU|:x:|2.0|
|XMRig|CPU|:x:|2.0|

## Make This Software Better
While this application started life as a couple of PowerShell scripts cobbled together over a weekend it has grown into something much larger.  Although we have strove to keep the application as free of defects as possible, it is very new and this is also our first time designing fully-fledged UI applications with Electron/React.  If you notice any issues, oddities, or things that "don't seem right", please let us know so we can fix them.

## Donate

If you like this software, please consider donating to the project.  All donations are greatly appreciated.

[Michael Vastarelli](https://github.com/mvastarelli) (Lead engineer)  
>BTC: bc1qa0cxkpxde2lwkf2pm909v6xxvual42tmltpt37  
>ETH: 0xC38d5c115dBbb2CeEb9603a1D9B272E2259c9a09  

[Evan Cohen](https://github.com/evan-cohen) (Front-end designer and specialist)  
>BTC: 19wj5WuKuraPyEAzmP3X2F3irKWw8uWkZt  
>ETH: 0x25a8a8c002273B9660DF59ad767ae576647d5FC4  
