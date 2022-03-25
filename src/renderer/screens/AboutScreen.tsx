import { useEffect, useState } from 'react';
import { Container, Typography, Divider } from '@mui/material';
import { ScreenHeader } from '../components';
import { aboutApi } from '../../shared/AboutApi';

function ExternalLink(props: { label: string; text: string; url: string }) {
  const { label, text, url } = props;

  return (
    <div style={{ display: 'flex' }}>
      <Typography>{label}:&nbsp;</Typography>
      <Typography onClick={async () => aboutApi.openBrowser(url)}>{text}</Typography>
    </div>
  );
}

export function AboutScreen(): JSX.Element {
  const [appName, setAppName] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [electronVersion, setElectronVersion] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setAppName(await aboutApi.getName());
      setAppVersion(await aboutApi.getVersion());
      setElectronVersion(await aboutApi.getElectronVersion());
    };

    loadData();
  });

  return (
    <Container>
      <ScreenHeader title="About" />
      <Typography variant="h6">Application Name - BitCobblers {appName}</Typography>
      <Typography variant="h6">Application Version - {appVersion}</Typography>
      <Typography variant="h6">Electron Version - {electronVersion}</Typography>
      <br />
      <Divider />
      <br />
      <ExternalLink label="GitHub" text="Project Page" url="https://github.com/bitcobblers/multiminer" />
      <ExternalLink label="LolMiner" text="Website" url="https://lolminer.site/" />
      <ExternalLink label="T-Rex" text="Website" url="https://trex-miner.com/" />
      <ExternalLink label="PhoenixMiner" text="Website" url="https://phoenixminer.org/" />
      <ExternalLink label="NBMiner" text="Website" url="https://nbminer.info/" />
      <ExternalLink label="XMRig" text="Website" url="https://xmrig.com/" />
      <br />
      <Divider />
      <br />
      <Typography variant="body1" gutterBottom>
        WARNING: Mining places a tremendous amount of stress on your PC components and can lead to can lead to premature failure or permanent damage if configured incorrectly. It also uses additional
        electricity and increases the heat output of the PC, so be sure to regularly monitor the hardware internals to ensure that they stay within acceptable operating ranges. All mining software in
        the application is configured by default to run with their default settings and will not automatically apply any overclocking settings. Be sure to check the mining application&apos;s website
        for documentation on how to configure additional settings.
      </Typography>
      <br />
      <Divider />
      <br />
      <Typography variant="body1" gutterBottom>
        THIS SOFTWARE IS PROVIDED BY THE AUTHOR &apos;&apos;AS IS&apos;&apos; AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
        FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
        LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
        LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      </Typography>
    </Container>
  );
}
