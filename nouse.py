import time
# selenium 4
from selenium import webdriver
from selenium.webdriver.common.by import By
import undetected_chromedriver as un_webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.wait import WebDriverWait

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
PROXY = "127.0.0.1:7890"
webdriver.DesiredCapabilities.CHROME['proxy'] = {
    "httpProxy": PROXY,
    "ftpProxy": PROXY,
    "sslProxy": PROXY,
    "proxyType": "MANUAL",

}


def document_initialised(driver):
    return driver.execute_script("return initialised")


class ChatGptR():
    def __init__(self, user, passwd):
        capabilities = webdriver.DesiredCapabilities.CHROME.copy()
        capabilities['proxy'] = {
            "httpProxy": PROXY,
            "ftpProxy": PROXY,
            "sslProxy": PROXY,
            "proxyType": "MANUAL",

        }
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--proxy-server=127.0.0.1:7890')
        self.driver = un_webdriver.Chrome(options=chrome_options, desired_capabilities=capabilities)
        self.home()
        self.login(user, passwd)

    def home(self):
        self.driver.get("https://chat.openai.com")
        WebDriverWait(self.driver, timeout=30).until(lambda d: d.find_element(By.XPATH, '//button[text()="Log in"]'))

    def login(self, g_user, g_pass):
        lb = self.driver.find_element(by=By.XPATH, value='//button[text()="Log in"]')
        lb.click()
        google_login_button = "//button[@data-provider='google']"
        WebDriverWait(self.driver, timeout=30).until(lambda d: d.find_element(By.XPATH, google_login_button))
        gb = self.driver.find_element(by=By.XPATH, value=google_login_button)
        gb.click()
        email_text = "//input[@type='email']"

        WebDriverWait(self.driver, timeout=30).until(lambda d: d.find_element(By.XPATH, email_text))
        email_text_ = self.driver.find_element(by=By.XPATH, value=email_text)

        email_text_.send_keys(g_user)
        next_button = '//button[./span="下一步"]'

        WebDriverWait(self.driver, timeout=10).until(lambda d: d.find_element(By.XPATH, next_button))
        next_button_ = self.driver.find_element(by=By.XPATH, value=next_button)
        next_button_.click()

        email_pass = "//input[@type='password']"
        WebDriverWait(self.driver, timeout=10).until(lambda d: d.find_element(By.XPATH, email_pass))

        email_pass_ = self.driver.find_element(by=By.XPATH, value=email_pass)
        email_pass_.send_keys(g_pass)
        WebDriverWait(self.driver, timeout=10).until(lambda d: d.find_element(By.XPATH, next_button))
        next_button_ = self.driver.find_element(by=By.XPATH, value=next_button)
        next_button_.click()


def main():
    c = ChatGptR(user=mail_address, passwd=password)
    time.sleep(10000)


if __name__ == '__main__':
    main()
