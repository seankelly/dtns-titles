import setuptools

setuptools.setup(
    name="toms-tech-news-titles",
    version="0.2.0",
    author="Sean Kelly",
    author_email="author@example.com",
    description="Scripts to query titles for Tom Merritt's tech show titles",
    url="https://github.com/pypa/sampleproject",
    packages=setuptools.find_packages(),
    install_requires=[
        'BeautifulSoup4',
        'lxml',
        'python-dateutil',
        'requests',
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
