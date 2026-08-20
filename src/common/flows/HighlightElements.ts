export async function highlightElements(elementSelectors: import('@playwright/test').Locator | null) {
    if (elementSelectors) {
        await elementSelectors.evaluate(el => {
            (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).style.border = '2px solid red';
            (el as HTMLElement).style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        });
    } else {
        console.warn(`Element with selector ${elementSelectors} not found.`);
    }
}

export async function highlightElementBorder(elementSelectors: import('@playwright/test').Locator | null) {
    if (elementSelectors) {
        await elementSelectors.evaluate(el => {
            (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).style.border = '2px solid red';
        });
    } else {
        console.warn(`Element with selector ${elementSelectors} not found.`);
    }
}
