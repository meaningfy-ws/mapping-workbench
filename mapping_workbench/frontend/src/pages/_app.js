// Remove if react-quill is not used
import 'react-quill/dist/quill.snow.css';
// Remove if react-draft-wysiwyg is not used
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// Remove if simplebar is not used
import 'simplebar-react/dist/simplebar.min.css';
// Remove if mapbox is not used
import 'mapbox-gl/dist/mapbox-gl.css';
import Head from 'next/head';
import {Provider as ReduxProvider} from 'react-redux';
import {CacheProvider} from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

import {RTL} from 'src/components/rtl';
import {SplashScreen} from 'src/components/splash-screen';
import {SettingsButton} from 'src/components/settings/settings-button';
import {SettingsDrawer} from 'src/components/settings/settings-drawer';
import {Toaster} from 'src/components/toaster';
import {AuthConsumer, AuthProvider} from 'src/contexts/auth/jwt';
import {SettingsConsumer, SettingsProvider} from 'src/contexts/settings';
import {ProjectsConsumer, ProjectsProvider} from "../contexts/projects";
import {useNprogress} from 'src/hooks/use-nprogress';
import {store} from 'src/store';
import {createTheme} from 'src/theme';
import {createEmotionCache} from 'src/utils/create-emotion-cache';

// Remove if locales are not used
// import {SessionProvider} from "next-auth/react";
import 'src/locales/i18n';
import {GlobalStateConsumer, GlobalStateProvider} from "../contexts/globalState";

const clientSideEmotionCache = createEmotionCache();

const CustomApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, session } = props;
  useNprogress();
  const getLayout = Component.getLayout ?? ((page) => page);

  return (

    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Mapping Workbench
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>

      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <AuthConsumer>
              {(auth) => (
          // <SessionProvider session={session}>

                  <GlobalStateProvider>
                    <GlobalStateConsumer>
                      {() => (

                      <SettingsProvider>
                        <SettingsConsumer>
                          {(settings) => {
                            // Prevent theme flicker when restoring custom settings from browser storage
                            if (!settings.isInitialized) {
                              //return null;
                            }

                            const theme = createTheme({
                              colorPreset: settings.colorPreset,
                              contrast: settings.contrast,
                              direction: settings.direction,
                              paletteMode: settings.paletteMode,
                              responsiveFontSizes: settings.responsiveFontSizes
                            });

                            // Prevent guards from redirecting
                            const showSplashScreen = !auth.isInitialized;

                            return (
                              <ThemeProvider theme={theme}>
                                <Head>
                                  <meta
                                    name="color-scheme"
                                    content={settings.paletteMode}
                                  />
                                  <meta
                                    name="theme-color"
                                    content={theme.palette.neutral[900]}
                                  />
                                </Head>
                                <RTL direction={settings.direction}>
                                  <CssBaseline />
                                    {showSplashScreen
                                      ? <SplashScreen />
                                      : (
                                        <>
                                          <ProjectsProvider>
                                            <ProjectsConsumer>
                                              {(projects) => (
                                                getLayout(
                                                    <Component projects={projects}
                                                               {...pageProps} />
                                                ))}
                                              </ProjectsConsumer>
                                          </ProjectsProvider>
                                          <SettingsButton onClick={settings.handleDrawerOpen} />
                                          <SettingsDrawer
                                            canReset={settings.isCustom}
                                            onClose={settings.handleDrawerClose}
                                            onReset={settings.handleReset}
                                            onUpdate={settings.handleUpdate}
                                            open={settings.openDrawer}
                                            values={{
                                              colorPreset: settings.colorPreset,
                                              contrast: settings.contrast,
                                              direction: settings.direction,
                                              paletteMode: settings.paletteMode,
                                              responsiveFontSizes: settings.responsiveFontSizes,
                                              stretch: settings.stretch,
                                              layout: settings.layout,
                                              navColor: settings.navColor
                                            }}
                                          />
                                        </>
                                      )}
                                  <Toaster />
                                </RTL>
                              </ThemeProvider>
                            );
                          }}
                        </SettingsConsumer>
                      </SettingsProvider>
                          )}
                    </GlobalStateConsumer>
                  </GlobalStateProvider>
          // </SessionProvider>

              )}

            </AuthConsumer>
          </AuthProvider>
        </LocalizationProvider>
      </ReduxProvider>

    </CacheProvider>

  );
};

export default CustomApp;
