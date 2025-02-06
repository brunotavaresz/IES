package weather;

import java.awt.Toolkit;
import java.util.Timer;
import java.util.TimerTask;

public class Main {
    Toolkit toolkit;

    Timer timer;

    public Main() {
        toolkit = Toolkit.getDefaultToolkit();
        timer = new Timer();
        timer.scheduleAtFixedRate(new RemindTask(), 0, // initial delay
                20 * 1000); // subsequent rate
    }

    class RemindTask extends TimerTask {
        public void run() {
            long time = System.currentTimeMillis();
            if (time - scheduledExecutionTime() > 5) {
                return;
            }
            WeatherStarter.main(null);
        }
    }

    public static void main(String args[]) {
        new Main();
    }
}
